import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro";
import { generateOpenGraphImage } from "astro-og-canvas";
import { getEssays } from "../../../content/essays";
import { essayImageOptions } from "../../../styles/openGraph";

export const getStaticPaths = (async () => {
  const essays = await getEssays();
  return essays.map((essay) => ({ params: { id: essay.id }, props: { title: essay.data.title } }));
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute<Props> = async ({ props: { title } }) => {
  const image = await generateOpenGraphImage(essayImageOptions(title));
  return new Response(image, {
    headers: { "Content-Type": "image/png" },
  });
};
