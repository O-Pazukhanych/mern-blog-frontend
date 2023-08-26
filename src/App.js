import Container from "@mui/material/Container";
import { Routes, Route } from "react-router-dom";

import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login } from "./pages";
import { useDispatch } from "react-redux";
import React from "react";
import { fetchAuthMe, } from "./redux/slices/auth";
import { TagPosts } from "./pages/TagPosts";

function App() {
	const dispath = useDispatch();

	React.useEffect(() => {
		dispath(fetchAuthMe());
	}, []);

	return (
		<>
			<Header />
			<Container maxWidth="lg">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/posts/:id" element={<FullPost />} />
					<Route path="/posts/:id/edit" element={<AddPost />} />
					<Route path="/add-post" element={<AddPost />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Registration />} />
					<Route path="/tags/:value" element={<TagPosts />} />
				</Routes>
			</Container>
		</>
	);
}

export default App;
