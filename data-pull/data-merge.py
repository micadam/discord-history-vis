import glob

import pandas as pd

import sqlite3


def main():
    files = glob.glob("results/*.csv")
    dfs = []
    for file in files:
        df = pd.read_csv(file)
        df["channel"] = file.split("/")[1].split("_")[0]
        dfs.append(df)
    df["id"] = df["id"].astype(str)
    df = pd.concat(dfs)
    df.to_csv("all.csv", index=False)
    print(f"Saved {len(df)} messages to results/all.csv")

    authors_df = pd.read_csv("main_authors.csv")
    authors_df["id"] = authors_df["id"].astype(str)

    db = sqlite3.connect("all.db")
    df.to_sql("messages", db, if_exists="replace")
    authors_df.to_sql("main_authors", db, if_exists="replace")
    db.close()
    print("Saved messages to results/all.db")


if __name__ == "__main__":
    main()
