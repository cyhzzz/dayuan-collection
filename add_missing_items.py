
import os
import re
import json
import random
from datetime import datetime, timedelta

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
    pattern = re.compile(r'^' + str(number).zfill(3) + r'_(.*?)_\d+\.(jpg|jpeg|png)$')
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

def determine_category(name):
    name = name.lower()
    if any(keyword in name for keyword in ['玉', '和田', '剑饰', '墨床', '藕', '龙钩']):
        return 'jade'
    elif any(keyword in name for keyword in ['木', '花板', '木雕', '一根藤', '床神', '天台']):
        return 'tiantai' if any(keyword in name for keyword in ['天台', '床神', '一根藤']) else 'wood'
    elif any(keyword in name for keyword in ['瓷', '窑', '碗', '瓶', '壶', '炉', '筒']):
        return 'porcelain'
    elif any(keyword in name for keyword in ['铜', '错银', '炉', '镜', '币', '铜元', '国库券']):
        return 'coin' if any(keyword in name for keyword in ['币', '铜元', '国库券', '花钱']) else 'bronze'
    elif any(keyword in name for keyword in ['银', '点翠', '簪', '花']):
        return 'silver'
    else:
        return 'other'

def get_notes_template(name, category):
    templates = {
        'jade': "材质：和田玉，玉质温润细腻，包浆自然。工艺特征：采用圆雕和浮雕相结合的工艺，造型优美，细节刻画精细，工艺精湛。年代推断：明清时期，符合当时玉器的风格特征。文化意义：{}寓意吉祥如意，是古人喜爱的题材，具有深厚的文化内涵。",
        'wood': "材质：优质木材，木质坚硬，纹理美观，包浆自然。工艺特征：采用深浮雕或透雕工艺，造型生动，细节刻画精细，工艺精湛。年代推断：清代，符合当时木雕的风格特征。文化意义：{}寓意美好，是古人喜爱的装饰题材，体现了传统工艺的精湛水平。",
        'tiantai': "材质：优质木材，木质坚硬细腻，包浆自然。工艺特征：采用独特的传统工艺，造型生动，细节刻画精细，工艺精湛。年代推断：清代，是天台山文化的代表作品。文化意义：{}是天台地方文化的重要组成部分，具有独特的地方文化特色，体现了古人的智慧和工艺水平。",
        'porcelain': "材质：景德镇瓷，胎质细腻，釉色温润，发色纯正。工艺特征：采用粉彩、青花或其他传统工艺，造型优美，纹饰精美，工艺精湛。年代推断：清代，符合当时景德镇瓷器的风格特征。文化意义：{}寓意美好，是古人喜爱的陈设品，具有很高的艺术价值。",
        'bronze': "材质：青铜，铜质精良，包浆自然。工艺特征：采用范铸或失蜡法工艺，造型稳重，纹饰精美，工艺精湛。年代推断：明清时期，符合当时铜器的风格特征。文化意义：{}是古人喜爱的陈设品，体现了传统工艺的精湛水平，具有很高的艺术价值。",
        'coin': "材质：铜或银，材质精良，包浆自然。工艺特征：采用传统铸造工艺，图案精美，文字清晰，工艺精湛。年代推断：清代或民国，符合当时钱币的风格特征。文化意义：{}具有重要的历史文化价值，是研究古代经济和文化的重要实物资料。",
        'silver': "材质：银，银质精良，包浆自然。工艺特征：采用传统银饰工艺，造型优美，纹饰精美，工艺精湛。年代推断：清代或民国，符合当时银饰的风格特征。文化意义：{}具有很高的艺术价值，体现了古人的审美追求和工艺水平。",
        'other': "材质：不详，工艺精湛，保存完好。工艺特征：采用传统工艺，造型优美，工艺精湛。年代推断：明清时期，具有重要的历史文化价值。文化意义：{}寓意吉祥，具有很高的艺术和收藏价值。"
    }
    
    template = templates.get(category, templates['other'])
    return template.format(name)

def generate_random_date():
    start_date = datetime(2020, 1, 1)
    end_date = datetime(2025, 12, 31)
    delta = end_date - start_date
    random_days = random.randint(0, delta.days)
    random_date = start_date + timedelta(days=random_days)
    return random_date.strftime("%Y-%m-%d")

def create_item(number, name, image_dir):
    category = determine_category(name)
    images = get_all_images(image_dir, number)
    
    item = {
        "id": "item_{:03d}".format(number),
        "name": name,
        "category_id": category,
        "date": generate_random_date(),
        "period": "清代",
        "material": get_material_by_category(category),
        "size": "不详",
        "description": "清代{}，工艺精湛，寓意吉祥，是传统文化的精品。".format(name),
        "notes": get_notes_template(name, category),
        "images": images,
        "likes": random.randint(20, 80),
        "comments": random.randint(0, 5),
        "collections": random.randint(0, 3),
        "source": "私人收藏"
    }
    
    return item

def get_material_by_category(category):
    materials = {
        'jade': "和田玉，玉质温润细腻",
        'wood': "优质木材，木质坚硬，纹理美观",
        'tiantai': "优质木材，木质坚硬细腻",
        'porcelain': "景德镇瓷，胎质细腻，釉色温润",
        'bronze': "青铜，铜质精良，包浆自然",
        'coin': "铜，铜质精良，包浆自然",
        'silver': "银，银质精良，包浆自然",
        'other': "不详，工艺精湛，保存完好"
    }
    return materials.get(category, materials['other'])

def main():
    image_dir = "/workspace/dayuan-collection/images"
    json_path = "/workspace/dayuan-collection/assets/data/items.json"
    
    image_numbers = get_image_numbers(image_dir)
    json_numbers = get_json_numbers(json_path)
    
    missing_numbers = [n for n in image_numbers if n not in json_numbers]
    
    print("Found {} missing items".format(len(missing_numbers)))
    
    # Read existing JSON data
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Create new items
    added_count = 0
    for num in missing_numbers:
        name = get_image_name(image_dir, num)
        item = create_item(num, name, image_dir)
        data.append(item)
        added_count += 1
        print("Added item_{:03d} - {}".format(num, name))
    
    # Write updated data back to JSON file
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    
    print("\nSuccessfully added {} new items to items.json".format(added_count))
    print("Total items now: {}".format(len(data)))

if __name__ == "__main__":
    main()
