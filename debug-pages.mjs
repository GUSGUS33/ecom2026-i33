import https from 'https';

const query = `{
  pages(first: 200, where: { status: PUBLISH }) {
    nodes {
      title
      uri
      slug
      template {
        __typename
        templateName
      }
    }
  }
}`;

const postData = JSON.stringify({ query });

const options = {
  hostname: 'creativu.es',
  path: '/graphql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const result = JSON.parse(data);
    const pages = result.data.pages.nodes;
    
    console.log(`\nTotal pages: ${pages.length}\n`);
    
    // Find sudaderas, polos, camisetas
    const keywords = ['sudadera', 'polo', 'camiseta'];
    console.log('=== Pages matching sudadera/polo/camiseta ===');
    for (const p of pages) {
      const uriLower = p.uri.toLowerCase();
      if (keywords.some(k => uriLower.includes(k))) {
        const normalizedUri = p.uri.replace(/^\/|\/$/g, '');
        console.log(`  slug="${p.slug}" uri="${p.uri}" normalized="${normalizedUri}" template="${p.template.__typename}"`);
      }
    }
    
    console.log('\n=== All Template_PlantillaSEOHeadlessMinimal pages ===');
    const seoPages = pages.filter(p => p.template.__typename === 'Template_PlantillaSEOHeadlessMinimal');
    console.log(`Count: ${seoPages.length}`);
    for (const p of seoPages) {
      const normalizedUri = p.uri.replace(/^\/|\/$/g, '');
      const hasSlash = normalizedUri.includes('/');
      console.log(`  ${hasSlash ? '⚠️ NESTED' : '✅ TOP'} slug="${p.slug}" uri="${p.uri}" normalized="${normalizedUri}"`);
    }
  });
});

req.write(postData);
req.end();
