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


export const footerView = () => {
  return (
    <footer>
      <div className='container j:flex j:items-center'>
        <div>
          <a href='/' className='logo-font'>
            conduit
          </a>
          <span className='attribution'>
            An interactive learning project from{' '}
            <a href='https://thinkster.io'>Thinkster</a>. Code &amp; design
            licensed under MIT.
          </span>
        </div>

        <div className='j:grow'></div>

        <div className='j:flex shrink-0 j:gap-[12px] j:text-gray-500'>
          <div className='j:text-[12px]'>
            Created by{' '}
            <a href='https://github.com/rinn7e' target='_blank'>
              rinn7e
            </a>
          </div>
          <div className='j:text-[12px]'>
            Using{' '}
            <a href='https://github.com/vankeisb/react-tea-cup' target='_blank'>
              react-tea-cup
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
