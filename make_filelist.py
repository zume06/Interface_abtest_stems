import json
import random

with open("./data/database.json", "r") as f:
    database = json.load(f)

out_dict = {}
for test_id in database:
    out_dict[test_id] = {}
    i = 0
    while f"query{i}" in database[test_id]:
        random_seed = random.randint(0, 1)
        out_dict[test_id][f"ab{i}"]={}
        if random_seed == 0:
            out_dict[test_id][f"ab{i}"]["a"]=database[test_id][f"query{i}"]["audio_path"]
            out_dict[test_id][f"ab{i}"]["b"]=database[test_id][f"query_comp{i}"]["audio_path"]
            out_dict[test_id][f"ab{i}"]["true"]="a"
        elif random_seed == 1:
            out_dict[test_id][f"ab{i}"]["a"]=database[test_id][f"query_comp{i}"]["audio_path"]
            out_dict[test_id][f"ab{i}"]["b"]=database[test_id][f"query{i}"]["audio_path"]
            out_dict[test_id][f"ab{i}"]["true"]="b"
        else:
            print("error")
        out_dict[test_id][f"ab{i}"]["inst"] = database[test_id][f"query{i}"]["inst"]
        i +=1
    out_dict[test_id]["retrieved"] = database[test_id]["retrieved"]["audio_path"]
    out_dict[test_id]["num_query"] = database[test_id]["num_query"]

with open("./data/file_list.json", "w") as f:
    json.dump(out_dict, f)