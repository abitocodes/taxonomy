npx prisma migrate dev --name describe_your_change

must do "pnpm dlx prisma generate" after pnpm install





</div>
        <div className="space-y-1 p-2.5">
          {post.createdAt && (
            <div className="flex items-center space-x-1.5 text-sm">
              {homePage && (
                <>
                  {post.communityImageURL ? (
                    <img className="rounded-full w-4.5 h-4.5 mr-2" src={post.communityImageURL} alt="community image" />
                  ) : (
                    <FaReddit className="text-primary text-xl mr-1" />
                  )}

                  <Link href={`r/${post.communityId}`}>
                    <span className="font-bold hover:underline" onClick={(event) => event.stopPropagation()}>{`r/${post.communityId}`}</span>
                  </Link>
                  <BsDot className="text-muted text-xs" />
                </>
              )}
              <span className="text-muted">
                Posted by u/{post.creator.nickName} {moment(post.createdAt).fromNow()}
              </span>
            </div>
          )}
          <span className="text-lg font-bold">
            {post.title}
          </span>


          <span className="text-sm">
              {post.description}
            </span>
            {post.link && (
              <div className="flex justify-center items-center p-2">
                {/* Microlink integration for link previews */}
              </div>
            )}
            {post.mediaURL && (
              <div className="flex justify-center items-center p-2">
                {post.mediaType === "video" ? (
                  <video controls src={post.mediaURL} className="max-h-96 w-full object-contain" />
                ) : (
                  <>
                    {loadingImage && <div className="h-52 w-full bg-muted animate-pulse rounded-md"></div>}
                    <img className={`max-h-96 w-full object-cover ${loadingImage ? "hidden" : "block"}`} src={post.mediaURL} onLoad={() => setLoadingImage(false)} alt="Post Image" />
                  </>
                )}
              </div>
            )}
          </div>
          <div className="ml-1 mb-1 text-muted font-bold flex">
            <div className="flex items-center p-2 rounded-md hover:bg-muted cursor-pointer">
              <BsChat className="mr-2" />
              <span className="text-sm">{post.numberOfComments}</span>
            </div>
            <div className="flex items-center p-2 rounded-md hover:bg-muted cursor-pointer">
              <IoArrowRedoOutline className="mr-2" />
              <span className="text-sm">Share</span>
            </div>
            <div className="flex items-center p-2 rounded-md hover:bg-muted cursor-pointer">
              <IoBookmarkOutline className="mr-2" />
              <span className="text-sm">Save</span>
            </div>
            {userIsCreator && (
              <div className="flex items-center p-2 rounded-md hover:bg-destructive cursor-pointer" onClick={handleDelete}>
                {loadingDelete ? (
                  <svg className="animate-spin h-5 w-5 border-t-2 border-primary rounded-full" viewBox="0 0 24 24"></svg>
                ) : (
                  <>
                    <AiOutlineDelete className="mr-2" />
                    <span className="text-sm">Delete</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </button>
  );
};