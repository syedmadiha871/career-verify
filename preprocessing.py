import pandas as pd
import re
import string
import nltk

# ===============================
# Download NLTK Resources
# (Runs only if not already downloaded)
# ===============================
nltk.download("stopwords", quiet=True)
nltk.download("wordnet", quiet=True)
nltk.download("omw-1.4", quiet=True)
nltk.download("punkt", quiet=True)

from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# ===============================
# Load Dataset
# ===============================
print("=" * 60)
print("Career Verify - Data Preprocessing")
print("=" * 60)

df = pd.read_csv("dataset/fake_job_postings.csv")

print("\nDataset Loaded Successfully!")
print(f"Total Records : {len(df)}")
print(f"Total Columns : {len(df.columns)}")

# ===============================
# Fill Missing Values
# ===============================

text_columns = [
    "title",
    "company_profile",
    "description",
    "requirements",
    "benefits"
]

for col in text_columns:
    df[col] = df[col].fillna("")

print("\nMissing text values handled successfully.")

# ===============================
# Merge Important Text Columns
# ===============================

df["text"] = (
    df["title"] + " " +
    df["company_profile"] + " " +
    df["description"] + " " +
    df["requirements"] + " " +
    df["benefits"]
)

print("Text columns merged successfully.")

# ===============================
# Initialize NLP Tools
# ===============================

stop_words = set(stopwords.words("english"))
lemmatizer = WordNetLemmatizer()

# ===============================
# Text Cleaning Function
# ===============================

def clean_text(text):

    # Convert to string
    text = str(text)

    # Convert to lowercase
    text = text.lower()

    # Remove URLs
    text = re.sub(r"http\S+|www\S+", "", text)

    # Remove email addresses
    text = re.sub(r"\S+@\S+", "", text)

    # Remove HTML tags
    text = re.sub(r"<.*?>", "", text)

    # Remove numbers
    text = re.sub(r"\d+", "", text)

    # Remove punctuation
    text = text.translate(str.maketrans("", "", string.punctuation))

    # Keep only alphabets
    text = re.sub(r"[^a-zA-Z\s]", " ", text)

    # Remove extra spaces
    text = re.sub(r"\s+", " ", text).strip()

    # Tokenize
    words = text.split()

    # Remove stopwords + Lemmatization
    cleaned_words = []

    for word in words:

        if word not in stop_words and len(word) > 2:

            cleaned_words.append(
                lemmatizer.lemmatize(word)
            )

    return " ".join(cleaned_words)

# ===============================
# Clean Text
# ===============================

print("\nCleaning text... Please wait.")

df["clean_text"] = df["text"].apply(clean_text)

print("Text cleaning completed successfully!")

# ===============================
# Keep Required Columns
# ===============================

processed_df = df[["clean_text", "fraudulent"]]

# ===============================
# Save Processed Dataset
# ===============================

processed_df.to_csv(
    "dataset/processed_job_postings.csv",
    index=False,
    encoding="utf-8"
)

# ===============================
# Display Sample Output
# ===============================

print("\nSample Processed Records")
print("-" * 60)

print(processed_df.head())

print("\nDataset Shape")
print(processed_df.shape)

print("\nFraud Distribution")
print(processed_df["fraudulent"].value_counts())

print("\nFraud Percentage")
print(
    round(
        processed_df["fraudulent"].value_counts(normalize=True) * 100,
        2
    )
)

print("\nProcessed dataset saved successfully!")

print("\nLocation:")
print("dataset/processed_job_postings.csv")

print("\n" + "=" * 60)
print("Preprocessing Completed Successfully")
print("=" * 60)