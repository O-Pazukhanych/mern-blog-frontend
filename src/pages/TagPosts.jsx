import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';

import { fetchTagPosts, fetchTags } from '../redux/slices/posts';
import { useParams } from 'react-router-dom';

export const TagPosts = () => {
	const dispath = useDispatch();
	const { posts, tags } = useSelector(state => state.posts);
	const userData = useSelector(state => state.auth.data);
	const { value } = useParams();


	React.useEffect(() => {
		dispath(fetchTagPosts(value));
		dispath(fetchTags());
	}, [value]);

	const isPostsLoading = posts.status === 'loading';
	const isTagsLoading = tags.status === 'loading';

	return (
		<>
			<h1>#{value}</h1>
			<Grid container spacing={4} className='grid-container'>
				{<Grid xs={8} item className='grid-item__posts-block'>
					{isPostsLoading ? ([...Array(5)]).map((obj, index) =>
						<Post
							key={index}
							isLoading={true}
						/>
					) : (posts.items).slice().reverse().map((obj) => (
						<Post
							key={obj._id}
							_id={obj._id}
							title={obj.title}
							imageUrl={obj.imageUrl ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}` : ''}
							user={obj.user}
							createdAt={obj.createdAt}
							viewsCount={obj.viewsCount}
							commentsCount={3}
							tags={obj.tags}
							isEditable={userData?._id === obj.user._id}
						/>
					))}
				</Grid>}
				<Grid xs={4} item className='grid-item__tags-block'>
					{
						isTagsLoading ? (
							<TagsBlock items={['react', 'typescript', 'JS']} isLoading={true} />
						) : (
							<TagsBlock items={tags.items} isLoading={false} />
						)}
				</Grid>
			</Grid>
		</>
	);
};
