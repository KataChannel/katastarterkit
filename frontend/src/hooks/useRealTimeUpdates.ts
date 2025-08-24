import { useEffect } from 'react';
import { useSubscription } from '@apollo/client';
import { NEW_POST_SUBSCRIPTION, NEW_COMMENT_SUBSCRIPTION } from '@/lib/graphql/queries';
import toast from 'react-hot-toast';

interface UseRealTimeUpdatesProps {
  onNewPost?: (post: any) => void;
  onNewComment?: (comment: any) => void;
  postId?: string;
  enableNewPosts?: boolean;
  enableNewComments?: boolean;
}

export function useRealTimeUpdates({
  onNewPost,
  onNewComment,
  postId,
  enableNewPosts = true,
  enableNewComments = false,
}: UseRealTimeUpdatesProps) {
  // Subscribe to new posts
  const { data: newPostData, error: newPostError } = useSubscription(
    NEW_POST_SUBSCRIPTION,
    {
      skip: !enableNewPosts,
      onSubscriptionData: ({ subscriptionData }) => {
        if (subscriptionData?.data?.postCreated) {
          const post = subscriptionData.data.postCreated;
          toast.success(`New post published: ${post.title}`, {
            duration: 5000,
            icon: '📝',
          });
          onNewPost?.(post);
        }
      },
      onError: (error) => {
        console.error('New post subscription error:', error);
        toast.error('Failed to connect to real-time updates');
      },
    }
  );

  // Subscribe to new comments for a specific post
  const { data: newCommentData, error: newCommentError } = useSubscription(
    NEW_COMMENT_SUBSCRIPTION,
    {
      variables: { postId },
      skip: !enableNewComments || !postId,
      onSubscriptionData: ({ subscriptionData }) => {
        if (subscriptionData?.data?.newComment) {
          const comment = subscriptionData.data.newComment;
          toast.success(`New comment by ${comment.author.username}`, {
            duration: 3000,
            icon: '💬',
          });
          onNewComment?.(comment);
        }
      },
      onError: (error) => {
        console.error('New comment subscription error:', error);
        toast.error('Failed to connect to comment updates');
      },
    }
  );

  useEffect(() => {
    if (newPostError) {
      console.error('Post subscription error:', newPostError);
    }
  }, [newPostError]);

  useEffect(() => {
    if (newCommentError) {
      console.error('Comment subscription error:', newCommentError);
    }
  }, [newCommentError]);

  return {
    newPost: newPostData?.postCreated,
    newComment: newCommentData?.newComment,
    errors: {
      newPost: newPostError,
      newComment: newCommentError,
    },
  };
}
