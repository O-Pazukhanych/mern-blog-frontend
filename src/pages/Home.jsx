import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';

import { fetchPosts, fetchTags } from '../redux/slices/posts';

export const Home = () => {
	const dispath = useDispatch();
	const { posts, tags } = useSelector(state => state.posts);
	const userData = useSelector(state => state.auth.data);
	const [tabValue, setTabValue] = React.useState(0);

	React.useEffect(() => {
		dispath(fetchPosts());
		dispath(fetchTags());
	}, []);

	const isPostsLoading = posts.status === 'loading';
	const isTagsLoading = tags.status === 'loading';

	return (
		<>
			<Tabs className='tabs' style={{ marginBottom: 15 }} value={tabValue} aria-label="basic tabs example">
				<Tab label="New" onClick={() => setTabValue(0)} />
				<Tab label="Popular" onClick={() => setTabValue(1)} />
			</Tabs>
			<Grid container spacing={4} className='grid-container'>
				{tabValue === 0 ?
					<Grid xs={8} item className='grid-item__posts-block'>
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
								imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
								user={obj.user}
								createdAt={obj.createdAt}
								viewsCount={obj.viewsCount}
								commentsCount={3}
								tags={obj.tags}
								isEditable={userData?._id === obj.user._id}
							/>
						))}
					</Grid> :
					<Grid xs={8} item className='grid-item__posts-block'>
						{isPostsLoading ? ([...Array(5)]).map((obj, index) =>
							<Post
								key={index}
								isLoading={true}
							/>
						) : (posts.items).slice().sort((a, b) => b.viewsCount - a.viewsCount).map((obj) => (
							<Post
								key={obj._id}
								_id={obj._id}
								title={obj.title}
								imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
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
