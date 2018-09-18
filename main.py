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
    change_to = None
    for role in member.server.roles:
        if role.name.lower() == "online":
            change_to = role
    await bot.add_roles(member, change_to)
    await bot.send_message(member, "Welcome to the Pizza Time server! Make sure you read <449160085726429185>.")

@bot.command(pass_context=True)
async def role(ctx, role_name):
    """Manage your roles.
    Should look like:
        /role [role name]
    The role name should be "Gmod", "Minecraft", etc.
    If you aready have the role, it will be removed, otherwise it will be added to you."""

    print("um....")
    print(role_name)
    change_to = None
    for role in ctx.message.server.roles:
        if role.name.lower() == role_name.lower():
            change_to = role
            role_name = role.name
    print(ctx.message.author.roles)
    if change_to is not None:
        if not role_name in ("Online"):  # Blacklist - used "in" for future
                try:
                    if any([r.name == role_name for r in ctx.message.author.roles]):
                        await bot.remove_roles(ctx.message.author, change_to)
                        await bot.say("You no longer have the %s role" % role_name)
                        
                    else:
                        await bot.add_roles(ctx.message.author, change_to)
                        await bot.say("You now have the %s role" %role_name)
                        await bot.send_message(ctx.message.author, "Welcome to the %s role, be sure to check out the important info channels before playing!" %role_name)
    
                except discord.Forbidden:
                    await bot.say("Sorry, I don't have the right permissions to change your roles.")
        else:
            await bot.say("Sorry, I don't have the right permissions to deal with that role.")
    else:
        await bot.say("Sorry, I couldn't find that role")

@bot.group()
async def stats():
    """Yay stats"""
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
        async for m in bot.logs_from(channel, limit=9999):
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

@bot.command(pass_context=True)
async def poll(ctx, *, msg):
    """Creates a poll.
    The poll should be in the following form:
    >poll question; option1; option2; etc."""
    msg = msg.split(";")
    output = "**" + ctx.message.author.name + "** asked **" + msg[0] + "**\n"
    blanks = 0
    for option in range(1, len(msg)):
        if msg[option] == "":
            blanks += 1
        else:
            output += ":regional_indicator_" + chr(96 + option - blanks) + ": " + msg[option] + "\n"
    poll_msg = await bot.say(output + "\n React with your answer!")
    for a in range(len(msg) - blanks - 1):
        await bot.add_reaction(poll_msg, eval("\"\\N{REGIONAL INDICATOR SYMBOL LETTER " + chr(65 + a) + "}\""))
    await bot.delete_message(ctx.message)


@bot.command()
async def announce():
    await bot.say("Added feature: You no longer have to put \"true\" or \"false\" at the end of role requests.")

bot.run(Token)
