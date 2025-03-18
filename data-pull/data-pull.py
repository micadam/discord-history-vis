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
MAX_CHUNK_SIZE = 10_000


@dataclass
class Message:
    id: str
    author: str
    content: str
    timestamp: str


def parse_args():
    parser = ap.ArgumentParser(description="Discord data scraper")
    parser.add_argument("--environment", choices=["test", "prod"], default="test")
    return parser.parse_args()


intents = discord.Intents.none()
intents.guilds = True
intents.message_content = True
client = discord.Client(intents=intents)


async def process_channel(channel: discord.TextChannel):
    chunk_id = 0

    print(f"Processing channel {channel.name}")
    messages: list[Message] = []
    history = channel.history(limit=None)
    try:
        async for message in history:
            messages.append(
                Message(
                    message.id, message.author.name, message.content, message.created_at
                )
            )
            if len(messages) >= MAX_CHUNK_SIZE:
                df = pd.DataFrame(messages)
                os.makedirs("results", exist_ok=True)
                df.to_csv(f"results/{channel.name}_{chunk_id}.csv", index=False)
                messages = []
                chunk_id += 1
            print(
                f"\rProcessed {chunk_id * MAX_CHUNK_SIZE + len(messages)} messages",
                end="",
            )
    except discord.errors.Forbidden:
        print(f"Skipping channel {channel.name} due to missing permissions")
        return
    print("Processed 0 messages", end="")

    if len(messages) > 0:
        df = pd.DataFrame(messages)
        os.makedirs("results", exist_ok=True)
        df.to_csv(f"results/{channel.name}_{chunk_id}.csv", index=False)
    print(
        f"Saved {chunk_id * MAX_CHUNK_SIZE + len(messages)} messages from {channel.name}"
    )


@client.event
async def on_ready():
    guild = discord.utils.get(client.guilds, id=int(client._server_id))
    if guild:
        for channel in guild.channels:
            if channel.type != discord.ChannelType.text:
                continue
            await process_channel(channel)
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
