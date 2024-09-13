import PageLayout from '@/components/page/PageLayout';
import PageSideBar from '@/components/page/PageSideBar';

export default function HomePage() {
  return (
    <PageLayout>
      <div>
        <PageSideBar>
          <p>test</p>
          <p>test</p>
          <p>test</p>
          <p>test</p>
          <p>test</p>
        </PageSideBar>
        <p>Home</p>
      </div>
    </PageLayout>
  );
}
