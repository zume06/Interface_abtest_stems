import json
import os
import re

out_dict = {}

for testname in sorted(os.listdir("./data/samples")):
    test_num = re.sub("test", "", testname)
    out_dict[test_num]={}
    with open(f"./data/samples/{testname}/config.json", "r") as f:
        query_dict = json.load(f)
    with open(f"./data/samples/{testname}/config_comp.json", "r") as f:
        query_comp_dict = json.load(f)
    for idx, file_name in enumerate(sorted(os.listdir(f"./data/samples/{testname}/queries"))):
        out_dict[test_num][f"query{idx}"]={}
        out_dict[test_num][f"query{idx}"]["inst"] = query_dict["queries"][f"query{idx}"]["inst"]
        out_dict[test_num][f"query{idx}"]["audio_path"] = f"./data/samples/{testname}/queries/{file_name}"
        out_dict[test_num][f"query_comp{idx}"]={}
        out_dict[test_num][f"query_comp{idx}"]["inst"] = query_comp_dict[f"query{idx}_comp"]["inst"]
        out_dict[test_num][f"query_comp{idx}"]["audio_path"] = f"./data/samples/{testname}/queries_comp/query{idx}_comp.mp3"
    out_dict[test_num]["num_query"]= idx + 1
    out_dict[test_num]["retrieved"] = {}
    out_dict[test_num]["retrieved"]["audio_path"] = f"./data/samples/{testname}/retrieved.mp3"

with open ("./data/database.json", "w") as f:
    json.dump(out_dict, f)