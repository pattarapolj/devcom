import React from "react";

import { getTags } from "@/lib/actions/tag.action";

const TagsPage = async () => {
    const { success, error, data } = await getTags({
        page: 1,
        pageSize: 10,
    });

    const { tags, isNext } = data || {};

    console.log("Tags:", JSON.stringify(tags, null, 2));

    return <div>TagsPage</div>;
};

export default TagsPage;
