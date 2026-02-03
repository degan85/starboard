import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Widget Preview - starboard",
};

export default function PreviewPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Widget Preview
          </h1>
          <p className="text-gray-600 mb-4">
            This is how your widget will look when embedded on a website.
          </p>
          <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg font-mono">
            Project slug: {params.slug}
          </div>
        </div>

        {/* Widget Container */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Live Preview
          </h2>
          
          {/* The actual widget */}
          <div id="starboard-widget" data-slug={params.slug}></div>
          <Script src="/widget.js" strategy="afterInteractive" />
        </div>

        {/* Embed Code */}
        <div className="bg-gray-900 rounded-xl p-6 mt-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Embed Code
          </h2>
          <pre className="text-sm text-green-400 overflow-x-auto whitespace-pre-wrap">
{`<div id="starboard-widget" data-slug="${params.slug}"></div>
<script src="${process.env.NEXTAUTH_URL || 'https://starboard-five.vercel.app'}/widget.js"></script>`}
          </pre>
        </div>
      </div>
    </div>
  );
}
