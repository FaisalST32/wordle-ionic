import axios from 'axios';
import { environment } from '../../environments/environment';

export default axios.create({
  baseURL: environment.production
    ? 'https://wordle-with-friends.herokuapp.com/'
    : 'http://localhost:2700',
});
