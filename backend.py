from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
import os

app = FastAPI()

@app.get("/")
async def init_func():
    file_path = os.path.join(os.path.dirname(__file__), "index.html")
    with open(file_path, "r") as f:
        return HTMLResponse(content=f.read())

@app.get("/{filename:path}")
async def serve_file(filename: str):
    # ファイルのパスを取得
    file_path = os.path.join(os.path.dirname(__file__), filename)

    # index.html だけはルートパスで提供する
    if filename == "":
        file_path = os.path.join(os.path.dirname(__file__), "index.html")

    # ファイルの拡張子による制御（例: js, css, htmlなど）
    allowed_extensions = ["html", "js", "css", "wav", "npy", "json", "mp3", "png"]
    file_extension = filename.split(".")[-1]

    if file_extension in allowed_extensions and os.path.exists(file_path):
        return FileResponse(file_path)

    # ファイルが見つからない場合
    return HTMLResponse(content="File not found", status_code=404)