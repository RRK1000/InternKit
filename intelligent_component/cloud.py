import matplotlib.pyplot as pPlot
from wordcloud import WordCloud,STOPWORDS
import numpy as npy
from PIL import Image
dataset = open("sampleWords.txt", "r").read()
def create_word_cloud(string):
   #maskArray = npy.array(Image.open("cloud.png"))
   cloud =WordCloud(background_color = "white", max_words = 200,stopwords = set(STOPWORDS)).generate(string)
   cloud.to_file("wordCloud.png")
   for i in cloud.layout_:
      print(i[0][1],i[1])
dataset = dataset.lower()
create_word_cloud(dataset)