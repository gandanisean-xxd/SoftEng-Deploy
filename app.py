import json
import numpy as np
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import logging
import re
from ollama import generate
from sentence_transformers import SentenceTransformer
import faiss

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)

# Hardcoded API key
API_KEY = 'FBB8KAYBW6NEP57PELECNHWRV'

# Load JSON data
with open(r'C:\Users\QCU\Documents\SE\Actual Code\SoftEng-main\qa_data.json', 'r') as f:
    qa_data = json.load(f)

categories = ['faqs', 'about', 'vague']
questions = []
answers = []
category_map = []

for cat in categories:
    for item in qa_data.get(cat, []):
        questions.append(item['question'])
        answers.append(item['answer'])
        category_map.append(cat)

# Embed questions
embed_model = SentenceTransformer('all-MiniLM-L6-v2')
question_embeddings = embed_model.encode(questions)
index = faiss.IndexFlatL2(question_embeddings.shape[1])
index.add(np.array(question_embeddings))

@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

@app.route('/weather', methods=['GET'])
def get_weather():
    location = request.args.get('location')
    if not location:
        return jsonify({'error': 'Location parameter is required'}), 400

    url = f'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/{location}'
    params = {'key': API_KEY, 'include': 'current'}

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        current = data.get('currentConditions', {})

        temp_f = current.get('temp')
        temp_c = (temp_f - 32) * 5 / 9 if temp_f else None

        weather_data = {
            'temperature': temp_c,
            'conditions': current.get('conditions'),
            'humidity': current.get('humidity'),
            'windSpeed': current.get('windspeed'),
            'windDirection': current.get('winddirection'),
            'location': location
        }
        return jsonify(weather_data)
    except requests.exceptions.RequestException as e:
        logging.error(f"Weather API error: {e}")
        return jsonify({'error': 'Failed to retrieve weather data'}), 500

@app.route('/embed', methods=['POST'])
def embed_new_question():
    data = request.json
    question = data.get('question')
    answer = data.get('answer')
    category = data.get('category', 'faqs')

    if not question or not answer:
        return jsonify({'error': 'Both question and answer are required'}), 400

    if category not in qa_data:
        qa_data[category] = []

    qa_data[category].append({'question': question, 'answer': answer})

    with open(r'C:\Users\QCU\Documents\SE\Actual Code\SoftEng-main\qa_data.json', 'w') as f:
        json.dump(qa_data, f, indent=2)

    questions.append(question)
    answers.append(answer)
    category_map.append(category)

    new_embedding = embed_model.encode([question])
    index.add(np.array(new_embedding))

    return jsonify({'message': f'New Q&A added to \"{category}\" and embedded.'})

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message')
    if not user_input:
        return jsonify({'error': 'Message is required'}), 400

    user_input = user_input.lower()

    # Non-English check
    if not re.match(r'^[\x00-\x7F]+$', user_input):
        return jsonify({'response': "Sorry, I can only understand English 🗣️"})

    greetings = ["hi", "hello", "hey", "good morning", "good evening"]
    if any(greet in user_input for greet in greetings):
        return jsonify({'response': "Hello! 😊 How can I help you today?"})

    for i, question in enumerate(questions):
        if question.lower() in user_input:
            return jsonify({'response': answers[i]})

    if any(keyword in user_input for keyword in ["weather", "gis", "meteorology"]):
        location = user_input.split("in")[-1].strip() if "in" in user_input else None
        if location:
            try:
                with app.test_request_context():
                    req = request
                    req.args = {'location': location}
                    weather_data = get_weather().get_json()

                return jsonify({
                    'response': (
                        f"Weather in {location}: {weather_data['conditions']}, "
                        f"{weather_data['temperature']:.1f}°C 🌡️, "
                        f"Humidity: {weather_data['humidity']}% 💧, "
                        f"Wind: {weather_data['windSpeed']} km/h 🌬️ "
                        f"from {weather_data['windDirection']}°"
                    )
                })
            except:
                return jsonify({'response': "Couldn't get the weather info, sorry!"})

    if len(user_input.split()) < 3:
        return jsonify({'response': "Can you ask a more specific question?"})

    irrelevant_keywords = [
        "tiktok", "facebook", "instagram", "twitter", "snapchat", "reddit", "netflix", "hulu",
        "youtube", "spotify", "apple music", "soundcloud", "gaming", "fortnite", "minecraft", "valorant",
        "roblox", "league of legends", "taylor swift", "drake", "bts", "blackpink", "kpop", "celebrity",
        "gossip", "memes", "jokes", "funny", "movies", "tv shows", "anime", "manga", "fanfic", "romance",
        "dating", "love", "crush", "relationship", "heartbreak", "breakup", "marriage", "wedding",
        "divorce", "parenting", "baby", "pets", "dog", "cat", "food", "recipes", "cooking", "baking",
        "restaurant", "fast food", "shopping", "fashion", "clothing", "makeup", "skincare", "beauty",
        "fitness", "workout", "exercise", "gym", "diet", "weight loss", "mental health", "therapy",
        "self-care", "finance", "money", "stocks", "investing", "crypto", "bitcoin", "nft", "real estate",
        "cars", "motorcycles", "travel", "vacation", "flight", "hotel", "airbnb", "beach", "mountain",
        "holiday", "birthday", "party", "event", "school", "exam", "homework", "assignment", "teacher",
        "classmate", "friend", "bullying", "drugs", "alcohol", "smoking", "crime", "murder", "violence",
        "war", "politics", "president", "election", "government", "law", "religion", "god", "atheism",
        "philosophy", "history", "art", "music", "book", "novel", "author", "poetry", "literature"
    ]

    if any(re.search(rf'\b{re.escape(k)}\b', user_input) for k in irrelevant_keywords):
        return jsonify({'response': "Let's stick to GIS, weather & meteorology 🌦️"})

    query_embedding = embed_model.encode([user_input])
    D, I = index.search(np.array(query_embedding), k=1)
    retrieved_question = questions[I[0][0]]
    retrieved_answer = answers[I[0][0]]

    logging.info(f"User: {user_input}")
    logging.info(f"Matched: {retrieved_question} → {retrieved_answer}")

    prompt = (
        "Your name is Chub, a concise and friendly AI assistant for a GIS web app.\n"
        "Respond briefly (3-10 words), without links, jokes, or questions. "
        "Use emojis appropriately. Only answer in English.\n"
        "Do not answer any private or sensitive questions.\n"
        "If a user asks about who made you, tell them concisely that you are made by EcoUrban Initiatives.\n"
        "Always respond briefly and politely.\n"
        "Do not ask users.\n"
        "If a user asks about personal information, politely decline to answer.\n"
        "Provide helpful and factual responses related to GIS and urban planning.\n"
        "Clarify any vague questions by asking for more details.\n"
        f"Question: {user_input}\n"
        "Answer:"
    )

    try:
        response = generate("tinyllama", prompt=prompt)
        return jsonify({'response': response.response.strip()})
    except Exception as e:
        logging.error(f"TinyLlama Error: {e}")
        return jsonify({'error': 'AI response failed'}), 500

if __name__ == '__main__':
    app.run(debug=True)