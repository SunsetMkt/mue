import React from 'react';

import WifiOffIcon from '@material-ui/icons/WifiOff';

export default class Changelog extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      title: null
    };
    this.language = window.language.modals.update;
  }

  async getUpdate() {
    const data = await (await fetch(window.constants.BLOG_POST + '/index.json')).json();

    this.setState({
      title: data.title,
      date: data.date.split(' ')[0],
      image: data.featured_image || null,
      author: 'By ' + data.author,
      html: data.html
    });
   }
  
   componentDidMount() {
    if (localStorage.getItem('offlineMode') === 'true') {
      return;
    }
  
    this.getUpdate();
   }

  render() {
    const errorMessage = (msg) => {
      return (
        <div className='emptyitems'>
          <div className='emptyMessage'>
            {msg}
          </div>
        </div>
      );
    };

    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      const language = window.language.modals.main.marketplace;
    
      return errorMessage(<>
        <WifiOffIcon/>
        <h1>{language.offline.title}</h1>
        <p className='description'>{language.offline.description}</p>
      </>);
    }
  
    if (!this.state.title) {
      return errorMessage(<h1>{window.language.modals.main.loading}</h1>);
    }

    return (
      <>
        <h1 style={{ 'marginBottom': '-10px' }}>{this.state.title}</h1>
        <h5 style={{ 'lineHeight': '0px' }}>{this.state.author} • {this.state.date}</h5>
        {this.state.image ? <img draggable='false' src={this.state.image} alt={window.language.modals.update.title} className='updateimage'/> : null}
        <div className='updatechangelog' dangerouslySetInnerHTML={{ __html: this.state.html }}/>
      </>
    );
  }
}