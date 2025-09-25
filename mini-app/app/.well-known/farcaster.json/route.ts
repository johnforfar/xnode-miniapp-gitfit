export const dynamic = "force-dynamic";

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL;

  const config = {
    accountAssociation: {
      header: "",
      payload: "",
      signature: "",
    },
    miniapp: {
      version: "1",
      name: "Xnode Mini App Template",
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/icon.png`,
      buttonTitle: "Launch Mini App",
      splashImageUrl: `${appUrl}/ico.png`,
      splashBackgroundColor: "#000000",
      webhookUrl: `${appUrl}/api/webhook`,
    },
  };

  return Response.json(config);
}
