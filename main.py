import discord
from discord.ext import commands
import os

bot = commands.Bot(description="Use me to organise your own roles", command_prefix="/")

Token = os.getenv("Token")
if Token is None:
    Token = open("token.txt", "r").read()

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

bot.run(Token)
