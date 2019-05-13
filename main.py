import discord
from discord.ext import commands
import os
import time


def text_list(txt):
    if len(txt) == 0:
        return ""
    elif len(txt) == 1:
             return txt[0]
    else:
        return ", ".join(txt[:-1]) + " and " + txt[-1]

Token = os.getenv("Token")
if Token is None:
	Token = open("token.txt", "r").read()
	client = commands.Bot(description="Use me to organise your own roles", command_prefix="\\")
else:
	client = commands.Bot(description="Use me to organise your own roles", command_prefix="/")


@client.event
async def on_ready():
    await client.change_presence(activity=discord.Game(name="type \"/help\" for help"))
    print("Ready")


@client.event
async def on_raw_reaction_add(payload):
	guild = client.get_guild(payload.guild_id)
	channel = guild.get_channel(payload.channel_id)
	msg = await channel.get_message(payload.message_id)
	user = guild.get_member(payload.user_id)
	emoji = payload.emoji.name
	if msg.content.startswith("**ROLES**") and msg.author.name == "Pizza Bot" and not user.name == "Pizza Bot":
		for role in guild.roles:
			if role.name == emoji:
				await user.add_roles(role)
				break
		if not role.name == emoji:
			await msg.remove_reaction(payload.emoji, user)


@client.event
async def on_raw_reaction_remove(payload):
	guild = client.get_guild(payload.guild_id)
	channel = guild.get_channel(payload.channel_id)
	msg = await channel.get_message(payload.message_id)
	user = guild.get_member(payload.user_id)
	emoji = payload.emoji.name
	if msg.content.startswith("**ROLES**") and msg.author.name == "Pizza Bot" and not user.name == "Pizza Bot":
		for role in guild.roles:
			if role.name == emoji:
				info = ""
				if emoji == "Minecraft":
					m_info = None
					console = None
					for c in user.guild.channels:
						if c.name == "minecraft-info":
							m_info = c
						elif c.name == "server-console":
							console = c
					async for m in m_info.history(limit=100):
						if m.content.startswith("**Whitelist:**") and m.author.name == "Pizza Bot":
							whitelist = m.content.split("\n")
							output = ""
							info = ""
							for line in whitelist:
								if line.split()[0] == user.mention:
									await console.send("whitelist remove " + line.split()[-1])
								else:
									output += line + "\n"
							await m.edit(content=output)
							break
				await user.remove_roles(role)
				break


@client.event
async def on_member_join(member):
	for role in member.guild.roles:
		if role.name.lower() == "gamers":
			await member.add_roles(role)
			break

	for c in member.guild.channels:
		if c.name == "general-discussion":
			await c.send("Welcome %s to the Pizza Time server!"%member.mention)
			break


@client.event
async def on_member_remove(member):
	m_info = None
	console = None
	general = None
	for c in member.guild.channels:
		if c.name == "minecraft-info":
			m_info = c
		elif c.name == "server-console":
			console = c
		elif c.name == "general":
			general = c
	async for m in m_info.history(limit=100):
		print(1)
		if m.content.startswith("**Whitelist:**") and m.author.name == "Pizza Bot":
			print(2)
			whitelist = m.content.split("\n")
			output = ""
			info = ""
			for line in whitelist:
				if line.split()[0] == member.mention:
					await console.send("whitelist remove " + line.split()[-1])
					info = "\nThe nickname **%s** was removed from the whitelist."%line.split()[-1]
				else:
					output += line + "\n"
			await m.edit(content=output)
	await general.send(member.mention + " (%s) has just left the server"%member.name + info)


@client.command(pass_context=True)
async def whitelist(ctx, *, msg):
	"""Use this to add a Minecraft username to the server whitelist.
	
	Should look like:  /whitelist [mc username]
	
	You must have the Minecraft role to add a username, and only one username per person is allowed."""
	msg = msg.split()
	adder = None
	wl_channel = None
	console = None
	for c in ctx.message.guild.channels:
		if c.name == "minecraft-info":
			wl_channel = c
		elif c.name == "server-console":
			console = c

	if any([role.name == "Mods" for role in ctx.author.roles]):
		if len(msg) == 3 and msg[1] == "for":
			msg[2] = "".join(msg[2].split("!"))
			adder = None
			for member in ctx.guild.members:
				if "".join(member.mention.split("!")) == msg[2]:
					adder = "".join(member.mentino.split("!"))
					break
			if adder is None: retuen
		elif len(msg) == 1:
			adder = "".join(ctx.author.mention.split("!"))
	elif len(msg) == 1 and any([role.name.lower() == "minecraft" for role in ctx.author.roles]):
		adder = "".join(ctx.author.mention.split("!"))
	else:
		await ctx.channel.send("Sorry, I couldn't do that - You may not have the right roles, or your message may have not been in the correct format.")
	if not (wl_channel is None or console is None or adder is None):
		async for m in wl_channel.history(limit=100):
			if m.content.startswith("**Whitelist:**") and m.author.name == "Pizza Bot":
				output = ""
				remove = ""
				for line in m.content.split("\n"):
					if line.split()[0] == adder:
						await console.send("whitelist remove " + line.split()[-1])
						remove = line.split()[-1]
					else:
						output += line + "\n"
				await console.send("whitelist add " + msg[0])
				new_whitelist = output + adder + " - " + msg[0]
				await m.edit(content=new_whitelist)
				if remove == "":
					output = ""
				else:
					output = "The nickname **" + remove + "** was removed from the whitelist.\n"
				await ctx.channel.send(output + "The nickname **" + msg[0] + "** was added to the whitelist.")
				break
		if not m.content.startswith("**Whitelist:**"):
			await ctx.channel.send("Sorry, I couldn't find the whitelist")


@client.command(pass_context=True)
async def role(ctx):
	"""React to the message in #server-info to get a role"""
	for channel in ctx.guild.channels:
		if channel.name == "server-info":
			await ctx.channel.send("React to the message in %s to get a role"%channel.mention)

@client.command(pass_context=True)
async def ping(ctx):
	"""Sends a ping to ask if people want to play"""
	message = await ctx.channel.send("@ here who wants to play now?")
	await message.add_reaction("✅")
	await message.add_reaction("❎")


@client.command(pass_context=True)
async def debug(ctx, *, msg):
	print(msg)


client.run(Token)