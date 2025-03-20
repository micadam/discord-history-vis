import argparse as ap
import os
from dataclasses import dataclass

import discord
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.environ["DISCORD_API_TOKEN"]
SERVER_ID_TEST = os.environ["SERVER_ID_TEST"]
SERVER_ID_PROD = os.environ["SERVER_ID_PROD"]
FILTER_ROLE_NAME = os.environ["FILTER_ROLE_NAME"]


@dataclass
class Author:
    id: str
    name: str


def parse_args():
    parser = ap.ArgumentParser(description="Discord data scraper")
    parser.add_argument("--environment", choices=["test", "prod"], default="test")
    return parser.parse_args()


intents = discord.Intents.none()
intents.guilds = True
intents.members = True
client = discord.Client(intents=intents)


@client.event
async def on_ready():

    guild = discord.utils.get(client.guilds, id=int(client._server_id))
    main_authors = []
    if guild:
        for member in guild.members:
            if any(role.name == FILTER_ROLE_NAME for role in member.roles):
                main_authors.append(Author(member.id, member.name))
        pd.DataFrame(main_authors).to_csv("main_authors.csv", index=False)
    await client.close()


def main():
    args = parse_args()
    if args.environment == "prod":
        print("This is a production run. Are you sure you want to continue? (y/n)")
        if input().lower() != "y":
            return

    client._server_id = SERVER_ID_TEST if args.environment == "test" else SERVER_ID_PROD
    client.run(TOKEN)


if __name__ == "__main__":
    main()
