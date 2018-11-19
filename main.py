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
				m = await channel.send(user.mention + " now has the **%s** role."%emoji)
				time.sleep(2)
				await m.delete()
				break


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
					whitelist = None
					console = None
					for c in user.guild.channels:
						if c.name == "whitelist":
							whitelist = c
						elif c.name == "server-console":
							console = c
					async for m in whitelist.history(limit=1): break
					whitelist = m.content.split("\n")
					output = ""
					info = ""
					for line in whitelist:
						if line.split()[0] == user.mention:
							await console.send("whitelist remove " + line.split()[-1])
							info = "\nThe nickname **%s** was removed from the whitelist."%line.split()[-1]
						else:
							output += line + "\n"
					await m.edit(content=output)
				await user.remove_roles(role)
				m = await channel.send(user.mention + " no longer has the **%s** role."%emoji + info)
				time.sleep(2)
				await m.delete()
				break


@client.event
async def on_member_join(member):
	change_to = None
	for role in member.guild.roles:
		if role.name.lower() == "gamers":
			change_to = role
			break
	if change_to is not None:
		await member.add_roles(change_to)

	channel = None
	for c in member.guild.channels:
		if c.name == "general":
			channel = c
			break
	if channel is not None:
		await channel.send("Welcome %s to the Pizza Time server! Make sure you read %s."%(member.mention, text_list(c)))


@client.event
async def on_member_remove(member):
	channel = None
	console = None
	general = None
	for c in member.guild.channels:
		if c.name == "whitelist":
			channel = c
		elif c.name == "server-console":
			console = c
		elif c.name == "general":
			general = c
	async for m in channel.history(limit=1): break
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
	msg = msg.split()
	adder = None
	wl_channel = None
	bl_channel = None
	console = None
	for c in ctx.message.guild.channels:
		if c.name == "whitelist":
			wl_channel = c
		elif c.name == "server-console":
			console = c
		elif c.name == "blacklist":
			bl_channel = c
	async for bl_old in bl_channel.history(limit=1): break

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
			if msg[0] in bl_old.content.split("\n"):
				bl_new = bl_old.content.split("\n")
				del bl_new[bl_new.index(msg[0])]
				await bl_old.edit("\n".join(bl_new))
				await ctx.channel.send("The name **%s** was removed from the blacklist."%msg[0])
				return
			else:
				adder = "".join(ctx.author.mention.split("!"))
	elif len(msg) == 1 and any([role.name.lower() == "minecraft" for role in ctx.guild.roles])  and not (msg[0] in bl_old.content.split("\n") or "".join(ctx.message.author.mention.split("!")) in bl_old.content.split("\n")):
		adder = "".join(ctx.author.mention.split("!"))
	else:
		await ctx.channel.send("Sorry, I couldn't do that - You may not have the right roles, or your message may have not been in the correct format.")
	if not (wl_channel is None or console is None or adder is None):
		async for m in wl_channel.history(limit=1): break
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


client.run(Token)