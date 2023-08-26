import React from "react";
import { useParams } from "react-router-dom";

import { Post } from "../components/Post";
import axios from "../axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const FullPost = () => {
	const { id } = useParams();
	const [data, setData] = React.useState();
	const [isLoading, setIsLoading] = React.useState(true);


	React.useEffect(() => {
		axios.get(`/posts/${id}`).then(res => {
			setData(res.data);
			setIsLoading(false);
		}).catch(error => {
			console.warn(error);
			alert('Error when receiving the post');
		});
	}, []);

	if (isLoading) {
		return <Post isLoading={isLoading} isFullPost />
	}

	return (
		<>
			<Post
				id={data._id}
				title={data.title}
				imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ''}
				user={data.user}
				createdAt={data.createdAt}
				viewsCount={data.viewsCount}
				commentsCount={3}
				tags={data.tags}
				isFullPost
			>
				<ReactMarkdown children={data.text} remarkPlugins={remarkGfm} />
			</Post>
		</>
	);
};
