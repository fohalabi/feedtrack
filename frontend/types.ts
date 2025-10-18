export interface Comment {
    id: string;
    author: string;
    text: string;
    createdAt: string;
}

export interface Feedback {
    id: string;
    title: string;
    description: string;
    category: string;
    upvotes: number;
    comments: Comment[];
    createdAt: string;
    upvotedBy: string[]; // Track who upvoted
}

export type SortOption = 'newest' | 'oldest' | 'most_upvotes' | 'least_upvotes' | 'most_comments' | 'least_comments';
export type Page = 'home' | 'add' | 'detail' | 'edit';