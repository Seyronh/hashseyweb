async function generateSitePassword(masterPassword, domain, length = 16) {
	if (!masterPassword || !domain) return "";

	const salt = new TextEncoder().encode(`${domain}:${length}`);
	const password = new TextEncoder().encode(masterPassword);

	// Importar la contraseña como clave
	const key = await crypto.subtle.importKey("raw", password, "PBKDF2", false, [
		"deriveBits",
	]);
	const derivedBits = await crypto.subtle.deriveBits(
		{
			name: "PBKDF2",
			salt: salt,
			iterations: 600000,
			hash: "SHA-256",
		},
		key,
		256, // 32 bytes
	);

	// Convertir a hex
	const hashArray = Array.from(new Uint8Array(derivedBits));
	const hashHex = hashArray
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");

	// Generar contraseña
	const chars =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
	let sitePassword = "";

	for (let i = 0; i < length; i++) {
		const index = parseInt(hashHex.substr(i * 2, 2), 16) % chars.length;
		sitePassword += chars[index];
	}

	return sitePassword;
}
export { generateSitePassword };
