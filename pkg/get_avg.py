import json
import os


# Written by @dvthanh19
def get_avg(path_prefix: str, new_value: float = None, attr: str = None):
    attr_list = ["light", "temperature", "humidity", "moisture"]
    if (not new_value) or (attr not in attr_list):
        return 0, 0
    new_avg = 0
    filename = f"{path_prefix}/data/avg_{attr}.txt"

    with open(filename, "r") as f:
        content = f.read()
        obj = json.loads(content)

    cur_avg = float(obj.get("current_avg", 0))
    n = float(obj.get("n", 0))
    new_avg = round((cur_avg * n + new_value) / (n + 1), 2)
    obj["current_avg"] = new_avg
    obj["n"] = n + 1

    with open(filename, "w") as f:
        f.write(json.dumps(obj, indent=2))

    return new_avg, 1


if __name__ == "__main__":
    print(get_avg(new_value=29, attr="temperature"))
