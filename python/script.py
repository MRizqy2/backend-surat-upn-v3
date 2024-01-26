import sys
import fitz
import pytesseract
from pytesseract import Output
import cv2
import math
import os

file_path = sys.argv[1]
output_path = sys.argv[2]
search_text = sys.argv[3]

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


def pdf_to_image(file_path, output_path):
    pdffile = file_path
    doc = fitz.open(pdffile)
    page = doc.load_page(0)
    pix = page.get_pixmap(matrix=fitz.Matrix(3, 3))
    output = output_path
    pix.save(output)
    doc.close()


def detect_specific_text(image_path, target_text):
    image = cv2.imread(image_path)
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    custom_config = r"--psm 6"
    boxes = pytesseract.image_to_boxes(
        gray_image, config=custom_config, output_type=Output.DICT
    )

    desired_letter = []
    x_position = []
    y_position = []

    for i in range(len(boxes["char"])):
        (x, y) = (
            boxes["left"][i],
            boxes["bottom"][i],
        )
        word = boxes["char"][i].strip()  # explain
        if word == "X" or word == "x":
            if len(desired_letter) < 5:
                desired_letter.append(word)
                x_position.append(x)
                y_position.append(y)
        else:
            continue

    desired_letter = "".join(desired_letter)
    if target_text == desired_letter.lower():
        print(
            math.floor(x_position[0] / 3),
            math.floor(y_position[-1] / 3),
        )


pdf_to_image(file_path, output_path)
detect_specific_text(output_path, search_text)
os.remove(output_path)