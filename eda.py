import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from wordcloud import WordCloud
from collections import Counter

# ---------------------------------------
# Create output folder
# ---------------------------------------

os.makedirs("output", exist_ok=True)

# ---------------------------------------
# Load Dataset
# ---------------------------------------

df = pd.read_csv("dataset/fake_job_postings.csv")

print("="*60)
print("Career Verify - Exploratory Data Analysis")
print("="*60)

print("\nDataset Shape:", df.shape)

# ---------------------------------------
# Missing Values
# ---------------------------------------

missing = df.isnull().sum().sort_values(ascending=False)

plt.figure(figsize=(12,6))
missing[missing > 0].plot(kind='bar')
plt.title("Missing Values")
plt.ylabel("Count")
plt.tight_layout()
plt.savefig("output/missing_values.png")
plt.close()

print("✓ Missing Values graph saved")

# ---------------------------------------
# Fraud Distribution
# ---------------------------------------

plt.figure(figsize=(6,5))
sns.countplot(x="fraudulent", data=df)
plt.title("Real vs Fake Job Postings")
plt.xlabel("Fraudulent")
plt.ylabel("Count")
plt.tight_layout()
plt.savefig("output/fraud_distribution.png")
plt.close()

print("✓ Fraud Distribution graph saved")

# ---------------------------------------
# Employment Type
# ---------------------------------------

plt.figure(figsize=(8,5))
df["employment_type"].fillna("Unknown").value_counts().plot(kind="bar")
plt.title("Employment Type")
plt.ylabel("Count")
plt.tight_layout()
plt.savefig("output/employment_type.png")
plt.close()

print("✓ Employment Type graph saved")

# ---------------------------------------
# Experience Level
# ---------------------------------------

plt.figure(figsize=(10,5))
df["required_experience"].fillna("Unknown").value_counts().plot(kind="bar")
plt.title("Required Experience")
plt.ylabel("Count")
plt.tight_layout()
plt.savefig("output/experience.png")
plt.close()

print("✓ Experience graph saved")

# ---------------------------------------
# Education Level
# ---------------------------------------

plt.figure(figsize=(10,5))
df["required_education"].fillna("Unknown").value_counts().plot(kind="bar")
plt.title("Required Education")
plt.ylabel("Count")
plt.tight_layout()
plt.savefig("output/education.png")
plt.close()

print("✓ Education graph saved")

# ---------------------------------------
# Word Cloud - Genuine Jobs
# ---------------------------------------

real_text = " ".join(
    df[df["fraudulent"] == 0]["description"]
    .fillna("")
    .astype(str)
)

wc_real = WordCloud(
    width=1000,
    height=500,
    background_color="white"
).generate(real_text)

plt.figure(figsize=(12,6))
plt.imshow(wc_real, interpolation="bilinear")
plt.axis("off")
plt.title("Word Cloud - Genuine Jobs")
plt.tight_layout()
plt.savefig("output/real_wordcloud.png")
plt.close()

print("✓ Genuine WordCloud saved")

# ---------------------------------------
# Word Cloud - Fake Jobs
# ---------------------------------------

fake_text = " ".join(
    df[df["fraudulent"] == 1]["description"]
    .fillna("")
    .astype(str)
)

wc_fake = WordCloud(
    width=1000,
    height=500,
    background_color="white"
).generate(fake_text)

plt.figure(figsize=(12,6))
plt.imshow(wc_fake, interpolation="bilinear")
plt.axis("off")
plt.title("Word Cloud - Fake Jobs")
plt.tight_layout()
plt.savefig("output/fake_wordcloud.png")
plt.close()

print("✓ Fake WordCloud saved")

# ---------------------------------------
# Top 20 Words
# ---------------------------------------

text = " ".join(df["description"].fillna("").astype(str)).lower()

words = text.split()

counter = Counter(words)

common = counter.most_common(20)

word_df = pd.DataFrame(common, columns=["Word", "Count"])

plt.figure(figsize=(12,6))
sns.barplot(data=word_df, x="Count", y="Word")
plt.title("Top 20 Most Frequent Words")
plt.tight_layout()
plt.savefig("output/top_words.png")
plt.close()

print("✓ Top Words graph saved")

# ---------------------------------------
# Summary
# ---------------------------------------

print("\n" + "="*60)
print("EDA Completed Successfully")
print("="*60)

print("\nGraphs saved in 'output/' folder:")
print("-------------------------------------")
print("✓ missing_values.png")
print("✓ fraud_distribution.png")
print("✓ employment_type.png")
print("✓ experience.png")
print("✓ education.png")
print("✓ real_wordcloud.png")
print("✓ fake_wordcloud.png")
print("✓ top_words.png")