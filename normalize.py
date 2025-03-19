from pydub import AudioSegment
from pydub.effects import normalize
import os


root = "./data/samples_org"
out = "./data/samples"
for testname in os.listdir(root):
    q_path = f"{root}/{testname}/queries"
    for file in os.listdir(q_path):
        audio = AudioSegment.from_file(f"{q_path}/{file}", format="mp3")
        normalized_audio = normalize(audio)
        out_dir = f"{out}/{testname}/queries"
        os.makedirs(out_dir, exist_ok=True)
        normalized_audio.export(f"{out_dir}/{file}", format="mp3")
    q_path = f"{root}/{testname}/queries_comp"
    for file in os.listdir(q_path):
        audio = AudioSegment.from_file(f"{q_path}/{file}", format="mp3")
        normalized_audio = normalize(audio)
        out_dir = f"{out}/{testname}/queries_comp"
        os.makedirs(out_dir, exist_ok=True)
        normalized_audio.export(f"{out_dir}/{file}", format="mp3")
    
    audio = AudioSegment.from_file(f"{root}/{testname}/retrieved.mp3", format="mp3")
    normalized_audio = normalize(audio)
    normalized_audio.export(f"{out}/{testname}/retrieved.mp3", format="mp3")