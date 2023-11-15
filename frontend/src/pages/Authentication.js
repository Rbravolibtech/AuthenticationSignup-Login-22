import { json, redirect } from "react-router-dom";
import AuthForm from "../components/AuthForm";

function AuthenticationPage() {
	return <AuthForm />;
}

export default AuthenticationPage;

export async function action({ request }) {
	const searchParams = new URL(request.url).searchParams;
	const mode = searchParams.get("mode") || "login";

	if (mode !== "login" && mode !== "signup") {
		throw json({ message: "Unsupported mode" }, { status: 422 });
	}

	const data = await request.formData();
	const authData = {
		email: data.get("email"),
		password: data.get("password"),
	};

	const response = await fetch("http://localhost:8080/" + mode, {
		method: "POST",
		headers: {
			"CONTENT-TYPE": "APPLICATION/JSON",
		},
		body: JSON.stringify(authData),
	});

	if (response.status === 422 || response.status === 401) {
		return response;
	}

	if (!response.ok) {
		throw json({ message: "COULD NOT AUTHENTICATE USER!!" }, { status: 500 });
	}
	//soon: manage that token
	return redirect("/");
}
