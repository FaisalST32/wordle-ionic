import axios from 'axios';
import { environment } from '../../environments/environment';

export default axios.create({
  baseURL: environment.production
    ? 'https://wordle-server-sa9g.onrender.com/'
    : 'http://localhost:2700',
});
