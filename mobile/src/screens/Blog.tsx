import React, { useState } from "react";
import { Image, View, Share, useWindowDimensions } from "react-native";
import RenderHtml from "react-native-render-html";
import { useNavigation, useRoute } from "@react-navigation/native";
import api from "../core/api";
import { useCopy } from "../core/copy";
import { useWebsiteCopy } from "../core/websiteCopy";
import { openLink } from "../core/links";
import { useResource } from "../core/useResource";
import { shortDate } from "../utils/dates";
import {
  Page,
  Title,
  Heading,
  Body,
  Input,
  Button,
  LinkRow,
  LoadState,
  styles,
  palette,
} from "../ui/kit";
type Tag = { id: number; name: string; slug: string };
type Post = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  author?: { name: string };
  tags: Tag[];
  publishedAt: string | null;
  featuredImage: string | null;
  readingTimeMinutes: number;
};
type PostPage = {
  content: Post[];
  totalPages: number;
  number: number;
  hasNext?: boolean;
};
export function RichText({ html }: { html: string }) {
  const { width } = useWindowDimensions(),
    nav = useNavigation<any>();
  return (
    <RenderHtml
      contentWidth={Math.min(width - 40, 720)}
      source={{ html, baseUrl: "https://azdoc.ai" }}
      ignoredDomTags={["script", "style", "iframe", "object", "embed", "form"]}
      baseStyle={{ color: palette.ink, fontSize: 17, lineHeight: 27 }}
      tagsStyles={{
        a: { color: palette.blue },
        h2: { fontSize: 24, lineHeight: 30 },
        h3: { fontSize: 20, lineHeight: 27 },
        p: { marginTop: 0, marginBottom: 16 },
      }}
      renderersProps={{
        a: { onPress: (_event: any, href: string) => void openLink(nav, href) },
      }}
    />
  );
}
function PostCard({ post }: { post: Post }) {
  const nav = useNavigation<any>(),
    t = useWebsiteCopy(),
    { language } = useCopy();
  return (
    <View style={styles.line}>
      {post.featuredImage && !post.featuredImage.includes("example.com") && (
        <Image
          source={{ uri: post.featuredImage }}
          style={{ height: 180, borderRadius: 14 }}
          accessibilityLabel={post.title}
        />
      )}
      <LinkRow
        title={post.title}
        onPress={() => nav.push("Article", { slug: post.slug })}
      />
      <RichText html={post.summary || ""} />
      <Body small>
        {post.author?.name || t("blog.anonymous")}
        {post.publishedAt ? ` - ${shortDate(post.publishedAt, language)}` : ""}
        {post.readingTimeMinutes
          ? ` - ${t("blog.readingTime", { minutes: post.readingTimeMinutes })}`
          : ""}
      </Body>
    </View>
  );
}
export function Blog() {
  const params = useRoute<any>().params || {};
  return (
    <BlogScope
      key={`${params.tag || ""}:${params.q || ""}`}
      initialQuery={params.q || ""}
      tag={params.tag}
    />
  );
}
function BlogScope({
  initialQuery,
  tag,
}: {
  initialQuery: string;
  tag?: string;
}) {
  const { c, language } = useCopy(),
    t = useWebsiteCopy(),
    nav = useNavigation<any>();
  const [input, setInput] = useState(initialQuery),
    [query, setQuery] = useState(initialQuery),
    [page, setPage] = useState(0);
  const posts = useResource(
    `blog:${language}:${tag || ""}:${query}:${page}`,
    async (signal) =>
      (
        await api.get<PostPage>(
          query
            ? "/blog/search"
            : tag
              ? `/blog/tag/${encodeURIComponent(tag)}`
              : "/blog",
          {
            params: {
              keyword: query || undefined,
              page,
              size: 9,
              language,
              sortBy: "publishedAt",
              direction: "desc",
            },
            signal,
          },
        )
      ).data,
  );
  const tags = useResource(
    "blog-tags",
    async (signal) =>
      (await api.get<Tag[]>("/tags/top", { params: { limit: 10 }, signal }))
        .data,
  );
  const tagInfo = useResource(
    tag ? `blog-tag:${tag}` : null,
    async (signal) =>
      (await api.get<Tag>(`/tags/${encodeURIComponent(tag!)}`, { signal }))
        .data,
  );
  return (
    <Page>
      <Title>{tagInfo.data?.name || t("blog.title")}</Title>
      <Body>{t("blog.subtitle")}</Body>
      <Input
        label={t("blog.search.title")}
        value={input}
        onChangeText={setInput}
        returnKeyType="search"
        onSubmitEditing={() => {
          setQuery(input.trim());
          setPage(0);
        }}
      />
      <Button
        label={c("Search", "Axtar", "Найти")}
        onPress={() => {
          setQuery(input.trim());
          setPage(0);
        }}
      />
      {(query || tag) && (
        <Button
          secondary
          label={c("All articles", "Bütün məqalələr", "Все статьи")}
          onPress={() => nav.push("Blog")}
        />
      )}
      <LoadState resource={posts} />
      {posts.data?.content.length === 0 && (
        <>
          <Heading>{t("blog.empty.title")}</Heading>
          <Body>{t("blog.empty.description")}</Body>
        </>
      )}
      {posts.data?.content.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {posts.data && posts.data.totalPages > 1 && (
        <View style={styles.spread}>
          <Button
            secondary
            disabled={page === 0}
            label={c("Previous", "Əvvəlki", "Назад")}
            onPress={() => setPage((p) => p - 1)}
          />
          <Body>
            {page + 1} / {posts.data.totalPages}
          </Body>
          <Button
            secondary
            disabled={page + 1 >= posts.data.totalPages}
            label={c("Next", "Növbəti", "Далее")}
            onPress={() => setPage((p) => p + 1)}
          />
        </View>
      )}
      <Heading>{t("blog.filter.byTag")}</Heading>
      <LoadState resource={tags} />
      {tags.data?.map((t) => (
        <LinkRow
          key={t.id}
          title={t.name}
          onPress={() => nav.push("Blog", { tag: t.slug })}
        />
      ))}
    </Page>
  );
}
export function Article() {
  const { slug } = useRoute<any>().params;
  return <ArticleScope key={slug} slug={slug} />;
}
function ArticleScope({ slug }: { slug: string }) {
  const nav = useNavigation<any>(),
    t = useWebsiteCopy(),
    { c, language } = useCopy();
  const post = useResource(
    `article:${slug}`,
    async (signal) =>
      (await api.get<Post>(`/blog/${encodeURIComponent(slug)}`, { signal }))
        .data,
  );
  const related = useResource(
    post.data ? `related:${slug}:${language}` : null,
    async (signal) =>
      (
        await api.get<PostPage>("/blog", {
          params: { page: 0, size: 6, language },
          signal,
        })
      ).data.content
        .filter(
          (p) =>
            p.id !== post.data!.id &&
            p.tags?.some((t) => post.data!.tags?.some((pt) => pt.id === t.id)),
        )
        .slice(0, 3),
  );
  const p = post.data;
  return (
    <Page>
      <LoadState resource={post} />
      {p && (
        <>
          <Title>{p.title}</Title>
          <Body small>
            {p.author?.name || t("blog.anonymous")}
            {p.publishedAt ? ` - ${shortDate(p.publishedAt, language)}` : ""}
            {p.readingTimeMinutes
              ? ` - ${t("blog.readingTime", { minutes: p.readingTimeMinutes })}`
              : ""}
          </Body>
          {p.featuredImage && !p.featuredImage.includes("example.com") && (
            <Image
              source={{ uri: p.featuredImage }}
              style={{ height: 230, borderRadius: 14 }}
              accessibilityLabel={p.title}
            />
          )}
          <RichText html={p.content || ""} />
          {p.tags?.map((tag) => (
            <LinkRow
              key={tag.id}
              title={tag.name}
              onPress={() => nav.push("Blog", { tag: tag.slug })}
            />
          ))}
          <Button
            secondary
            label={c("Share article", "Məqaləni paylaş", "Поделиться статьей")}
            onPress={async () => {
              await Share.share({
                message: `${p.title}\nhttps://azdoc.ai/blog/${encodeURIComponent(p.slug)}`,
              });
            }}
          />
          {!!related.data?.length && (
            <Heading>{t("blog.relatedPosts")}</Heading>
          )}
          {related.data?.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
          <LinkRow
            title={t("blog.backToList")}
            onPress={() => nav.push("Blog")}
          />
        </>
      )}
    </Page>
  );
}
