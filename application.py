import os
import requests

from flask import Flask, render_template, request, url_for, jsonify, redirect
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

users = []
channels = []
messgs = []

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        return "posted!"
    return render_template("index.html", channels=channels)

@app.route("/add", methods=["POST"])
def add():
    if len(request.form.get("channel")) < 4:
        return jsonify({"success": False})

    for channel in channels:
        if channel == request.form.get("channel"):
            return jsonify({"success": False})

    channels.append(request.form.get('channel'));
    messgs.append({"name": request.form.get("channel"),"messages": []});
    return jsonify({"success": True, "channel": request.form.get("channel")})

@app.route('/channel/<string:chn>', methods=["GET"])
def channel(chn):
    for channel in messgs:
        if (channel['name'] == chn):
            return render_template("channel.html", channel=chn, messages=channel['messages']);
    return redirect(url_for('index'));

@socketio.on("submit message")
def vote(data):
    channel = data['channel']
    for ch in messgs:
        if ch['name'] == channel:
            if len(ch['messages']) >= 100:
                ch['messages'].pop(0);
                ch['messages'].append(data);
            else:
                ch['messages'].append(data);

    emit("new message", data, broadcast=True)
