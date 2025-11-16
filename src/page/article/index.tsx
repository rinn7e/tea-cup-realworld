/*
 * MIT License
 *
 * Copyright (c) 2025 Moremi Vannak
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

export const ArticlePage = () => {
  return (
    <div className='article-page'>
      <div className='banner'>
        <div className='container'>
          <h1>How to build webapps that scale</h1>

          <div className='article-meta'>
            <a href='/profile/eric-simons'>
              <img src='http://i.imgur.com/Qr71crq.jpg' />
            </a>
            <div className='info'>
              <a href='/profile/eric-simons' className='author'>
                Eric Simons
              </a>
              <span className='date'>January 20th</span>
            </div>
            <button className='btn btn-sm btn-outline-secondary'>
              <i className='ion-plus-round'></i>
              &nbsp; Follow Eric Simons <span className='counter'>(10)</span>
            </button>
            &nbsp;&nbsp;
            <button className='btn btn-sm btn-outline-primary'>
              <i className='ion-heart'></i>
              &nbsp; Favorite Post <span className='counter'>(29)</span>
            </button>
            <button className='btn btn-sm btn-outline-secondary'>
              <i className='ion-edit'></i> Edit Article
            </button>
            <button className='btn btn-sm btn-outline-danger'>
              <i className='ion-trash-a'></i> Delete Article
            </button>
          </div>
        </div>
      </div>

      <div className='container page'>
        <div className='row article-content'>
          <div className='col-md-12'>
            <p>
              Web development technologies have evolved at an incredible clip
              over the past few years.
            </p>
            <h2 id='introducing-ionic'>Introducing RealWorld.</h2>
            <p>It's a great solution for learning how other frameworks work.</p>
            <ul className='tag-list'>
              <li className='tag-default tag-pill tag-outline'>realworld</li>
              <li className='tag-default tag-pill tag-outline'>
                implementations
              </li>
            </ul>
          </div>
        </div>

        <hr />

        <div className='article-actions'>
          <div className='article-meta'>
            <a href='profile.html'>
              <img src='http://i.imgur.com/Qr71crq.jpg' />
            </a>
            <div className='info'>
              <a href='' className='author'>
                Eric Simons
              </a>
              <span className='date'>January 20th</span>
            </div>
            <button className='btn btn-sm btn-outline-secondary'>
              <i className='ion-plus-round'></i>
              &nbsp; Follow Eric Simons
            </button>
            &nbsp;
            <button className='btn btn-sm btn-outline-primary'>
              <i className='ion-heart'></i>
              &nbsp; Favorite Article <span className='counter'>(29)</span>
            </button>
            <button className='btn btn-sm btn-outline-secondary'>
              <i className='ion-edit'></i> Edit Article
            </button>
            <button className='btn btn-sm btn-outline-danger'>
              <i className='ion-trash-a'></i> Delete Article
            </button>
          </div>
        </div>

        <div className='row'>
          <div className='col-xs-12 col-md-8 offset-md-2'>
            <form className='card comment-form'>
              <div className='card-block'>
                <textarea
                  className='form-control'
                  placeholder='Write a comment...'
                  rows={3}
                ></textarea>
              </div>
              <div className='card-footer'>
                <img
                  src='http://i.imgur.com/Qr71crq.jpg'
                  className='comment-author-img'
                />
                <button className='btn btn-sm btn-primary'>Post Comment</button>
              </div>
            </form>

            <div className='card'>
              <div className='card-block'>
                <p className='card-text'>
                  With supporting text below as a natural lead-in to additional
                  content.
                </p>
              </div>
              <div className='card-footer'>
                <a href='/profile/author' className='comment-author'>
                  <img
                    src='http://i.imgur.com/Qr71crq.jpg'
                    className='comment-author-img'
                  />
                </a>
                &nbsp;
                <a href='/profile/jacob-schmidt' className='comment-author'>
                  Jacob Schmidt
                </a>
                <span className='date-posted'>Dec 29th</span>
              </div>
            </div>

            <div className='card'>
              <div className='card-block'>
                <p className='card-text'>
                  With supporting text below as a natural lead-in to additional
                  content.
                </p>
              </div>
              <div className='card-footer'>
                <a href='/profile/author' className='comment-author'>
                  <img
                    src='http://i.imgur.com/Qr71crq.jpg'
                    className='comment-author-img'
                  />
                </a>
                &nbsp;
                <a href='/profile/jacob-schmidt' className='comment-author'>
                  Jacob Schmidt
                </a>
                <span className='date-posted'>Dec 29th</span>
                <span className='mod-options'>
                  <i className='ion-trash-a'></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
