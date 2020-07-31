async function getPing(str, guild) {
	if (str.match(/^<@(&|!?)\d{17,19}>$/)) {  // if it's already a ping
		return str
	}
	if (str.match(/^@?((h(ere)?)|(e(veryone)?))$/i)) {
		if (str.includes("h")) {
			return "@here"
		} else {
			return "@everyone"
		}
	}
	if (!guild) {return null}
	let members = guild.members.cache
	for (let member of members) {
		if (
			member[1].user.username.toLowerCase().includes(str.toLowerCase()) ||
			member[1].displayName.toLowerCase().includes(str.toLowerCase()) ||
			member[1].id == str
		) {
			return member[1]
		}
	}
	let roles = guild.roles.cache
	for (let role of roles) {
		if (
			role[1].name.toLowerCase().includes(str.toLowerCase()) ||
			role[1].id == str
		) {
			return role[1]
		}
	}
	return null
}

module.exports = {getPing: getPing}