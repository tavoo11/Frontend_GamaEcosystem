import React from 'react';
import '../../assetss/css/Bolg.css';

const Blog = () => {
  
    const blogPosts = [
      {
        image: 'https://www.concienciaeco.com/wp-content/uploads/2015/12/ginkgo-biloba-larbre-aux-mille-ecus-l-21.jpg',
        title: 'Hermoso Ginkgo florecido',
        date: 'May 14, 2019',
      },
      {
        image: 'https://media.traveler.es/photos/61376ce6f00fb1ba8d86755a/master/w_1600%2Cc_limit/141472.jpg',
        title: 'Hermoso Glicina Japones',
        date: 'May 14, 2019',
      },
      {
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJmMBrGUbPzfoOJbZIkvHuRW81CY5_dV2hdQ&s',
        title: 'Los arboles japoneses deslumbran en otoño',
        date: 'May 14, 2019',
      },
    ]
  
    return (
      <div className="blog-container">
        <h4>Blog</h4>
        <div className="blog-posts">
          {blogPosts.map((post, index) => (
            <div className="blog-post" key={index}>
              <img src={post.image} alt={post.title} className="blog-image" />
              <div className="blog-info">
                <div className="blog-title">{post.title}</div>
                <div className="blog-date">{post.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}

export default Blog;
