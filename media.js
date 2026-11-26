for(const button of document.querySelectorAll('[data-video]')){
 button.hidden=false;
 button.addEventListener('click',()=>{
  const id=button.dataset.video;if(!/^[A-Za-z0-9_-]{11}$/.test(id))return;
  const frame=document.createElement('iframe');
  frame.src=`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
  frame.title=button.dataset.videoTitle;
  frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';
  button.closest('[data-video-stage]').replaceChildren(frame);frame.focus();
 });
}
