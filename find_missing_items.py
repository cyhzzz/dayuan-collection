
import os
import re
import json

def get_image_numbers(image_dir):
    numbers = set()
    pattern = re.compile(r'^(\d+)_')
    for filename in os.listdir(image_dir):
        match = pattern.match(filename)
        if match:
            numbers.add(int(match.group(1)))
    return sorted(list(numbers))

def get_json_numbers(json_path):
    numbers = set()
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        for item in data:
            if 'id' in item:
                match = re.search(r'item_(\d+)', item['id'])
                if match:
                    numbers.add(int(match.group(1)))
    return sorted(list(numbers))

def get_image_name(image_dir, number):
    pattern = re.compile(r'^' + str(number).zfill(3) + r'_(.*?)_\d+\.jpg$')
    for filename in os.listdir(image_dir):
        match = pattern.match(filename)
        if match:
            return match.group(1)
    return "（无标题）"

def get_all_images(image_dir, number):
    pattern = re.compile(r'^' + str(number).zfill(3) + r'_.*\.(jpg|jpeg|png)$')
    images = []
    for filename in os.listdir(image_dir):
        if pattern.match(filename):
            images.append("images/" + filename)
    return sorted(images)

def main():
    image_dir = "/workspace/dayuan-collection/images"
    json_path = "/workspace/dayuan-collection/assets/data/items.json"
    
    image_numbers = get_image_numbers(image_dir)
    json_numbers = get_json_numbers(json_path)
    
    missing_numbers = [n for n in image_numbers if n not in json_numbers]
    
    print("Images available: {}".format(len(image_numbers)))
    print("Items in JSON: {}".format(len(json_numbers)))
    print("Missing numbers: {}".format(len(missing_numbers)))
    print()
    print("Missing numbers list:")
    for num in missing_numbers:
        name = get_image_name(image_dir, num)
        print("  {:03d} - {}".format(num, name))

if __name__ == "__main__":
    main()
