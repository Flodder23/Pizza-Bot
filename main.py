import discord
from discord.ext import commands
import os
import datetime

bot = commands.Bot(description="Use me to organise your own roles", command_prefix="/")

Token = os.getenv("Token")
if Token is None:
    Token = open("token.txt", "r").read()
    bot = commands.Bot(description="Use me to organise your own roles", command_prefix="\\")

@bot.event
async def on_ready():
    await bot.change_presence(game=discord.Game(name="type \"/help\" for help"))
    print("Ready")
    
@bot.event
async def on_member_join(member):
    role_name = "Online"
    change_to = None
    for role in member.server.roles:
        if role.name == role_name:
            change_to = role
    await bot.add_roles(member, change_to)

@bot.command(pass_context=True)
async def role(ctx, *, msg):
    """Manage your roles.
    Should look like:
        /role [role name] [True/False]
    The role name should be "Gmod", "Minecraft", etc.
    The True/False value represents whether you want to add it (True) or remove it (False)"""
    role_name, add = msg.split()[:2]
    change_to = None
    for role in ctx.message.server.roles:
        if role.name.lower() == role_name.lower():
            change_to = role
            role_name = role.name
    if change_to is not None:
        if role_name in ("Gmod", "Minecraft"):
                try:
                    if add.lower() == "true":
                        await bot.add_roles(ctx.message.author, change_to)
                        await bot.say("You now have the %s role" %role_name)
                    elif add.lower() == "false":
                        await bot.remove_roles(ctx.message.author, change_to)
                        await bot.say("You no longer have the %s role" % role_name)
                    else:
                        await bot.say("Sorry, I couldn't tell whether you wanted me to add (\"True\") or remove (\"False\") the role.")
                except discord.Forbidden:
                    await bot.say("Sorry, I don't have the right permissions to change your roles.")
        else:
            await bot.say("Sorry, I don't have the right permissions to deal with that role.")
    else:
        await bot.say("Sorry, I couldn't find that role")

@bot.group()
async def stats():
    pass

@stats.command(pass_context=True)
async def gmod(ctx, *, since):
    """Some stats about Gmod pings
    message should look like:
        /stats gmod [year.month.day]
    eg.
        /stats gmod 18.1.1
    would get only stats for pings after 01.01.2018
    if there is an error decoding the date argument, there is no limit placed on the time"""
    msg_count = 0
    people = {}
    since = since.split(".")
    try:
        after = datetime.datetime(int(since[0]), int(since[1]), int(since[2]))
    except:
        after = None
    for channel in ctx.message.server.channels:
        async for m in bot.logs_from(channel):
            if "@Gmod" in m.clean_content and (after is None or after < m.timestamp):
                msg_count += 1
                if m.author in people.keys():
                    people[m.author][1] += 1
                else:
                    people[m.author] = [m.author.mention, 1]
    max = 0
    ppl = []
    for person in people.items():
        person = person[1]
        if person[1] == max:
            ppl.append(person)
        elif person[1] > max:
            ppl = [person]
            max = person[1]
    output = "The Gmod role has been pinged a total of %s times"%msg_count
    o = ""
    for person in ppl:
        o += person[0] + ", "
    if max > 0:
        output += " with " + o[:-2] + " pinging the most, with %s pings"%max
    await bot.say(output + ".")

bot.run(Token)
