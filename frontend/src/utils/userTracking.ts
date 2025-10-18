export const getUserId = () => {
  let userId = localStorage.getItem('feedtrack_user_id');
  if (!userId) {
    userId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('feedtrack_user_id', userId);
  }
  return userId;
};