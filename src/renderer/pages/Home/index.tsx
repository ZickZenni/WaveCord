import Topbar from '../../components/Topbar';
import './Home.css';

export default function HomePage() {
  return (
    <div>
      <Topbar />
      <div className="home_page__container">
        <div className="home_page__sidebar" />
        <div className="home_page__content" />
      </div>
    </div>
  );
}
