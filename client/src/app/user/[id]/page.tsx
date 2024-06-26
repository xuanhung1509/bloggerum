import Pagination from '~/app/components/Pagination'
import Post from '~/app/components/Post'
import { PostProps } from '~/app/types'
import { PostActions } from './Actions'
import UserHeader from './UserHeader'

const UserPosts = async ({
    params,
    searchParams,
}: {
    params: { id: string }
    searchParams: { page: string; per_page: string }
}) => {
    const page = Number(searchParams.page) || 1
    const perPage = Number(searchParams.per_page)
    const res = await fetch(
        `${process.env.API_BASE_URL}/posts?userId=${params.id}`
    )
    const { posts, totalPages }: { posts: PostProps[]; totalPages: number } =
        await res.json()

    return (
        <div className="container">
            <UserHeader />
            <div className="mt-8">
                {totalPages === 0 && <div>No posts yet</div>}
                {totalPages > 0 && (
                    <>
                        <section className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                            {posts.map((post) => (
                                <div key={post._id} className="group relative">
                                    <Post post={post} />
                                    <PostActions post={post} />
                                </div>
                            ))}
                        </section>
                        <Pagination
                            totalPages={totalPages}
                            currentPage={page}
                            perPage={perPage}
                        />
                    </>
                )}
            </div>
        </div>
    )
}

export default UserPosts
