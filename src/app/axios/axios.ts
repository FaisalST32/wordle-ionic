import axios from 'axios';
import { environment } from '../../environments/environment';

export default axios.create({
  baseURL: environment.production
    ? 'https://wordle-engine.up.railway.app/'
    : 'http://localhost:2700',
});
