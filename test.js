const markdownContent = "[Your markdown content here]";

// 构造请求体
const formData = new FormData();
formData.append('file', new Blob([markdownContent], { type: 'text/markdown' }), 'example.md');
console.log(formData);