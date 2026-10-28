import { useMemo, useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import Accordion from '@/components/ui/Accordion';
import Button from '@/components/ui/Button';
import { SearchIcon } from '@/components/ui/icons';
import { helpTopics } from '@/pages/help-support/helpTopics';

const HelpSupportPage = () => {
  const [search, setSearch] = useState('');

  const filteredTopics = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return helpTopics;

    return helpTopics
      .map((topic) => ({
        ...topic,
        questions: topic.questions.filter(
          ({ question, answer }) =>
            question.toLowerCase().includes(query) || answer.toLowerCase().includes(query),
        ),
      }))
      .filter((topic) => topic.questions.length > 0);
  }, [search]);

  const scrollToTopic = (id: string) => {
    document
      .getElementById(`help-topic-${id}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#F1F5F9]">
      <PageHeader
        title="Help & Support"
        subtitle="Find answers to common questions and troubleshooting guides"
      />

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto px-6 pb-6 pt-4">
        <div className="relative w-full">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search for help topics..."
            className="h-10 w-full rounded-md border border-border py-2 pl-9 pr-3 text-sm text-[#94A3B8] outline-none "
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {helpTopics.map(({ id, title }) => (
            <Button
              key={id}
              type="button"
              variant="pill"
              size="sm"
              rounded={false}
              onClick={() => scrollToTopic(id)}
            >
              {title}
            </Button>
          ))}
        </div>

        {filteredTopics.map(({ id, title, iconSrc, questions }) => (
          <section
            key={id}
            id={`help-topic-${id}`}
            className="shrink-0 scroll-mt-4 overflow-hidden rounded-lg border border-border bg-white"
          >
            <div className="flex items-center gap-2 border-b border-border bg-[#F8FAFC] px-4 py-3">
              <img src={iconSrc} alt="" className="h-[30px] w-[30px] shrink-0" aria-hidden="true" />
              <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            </div>
            <Accordion
              items={questions.map(({ id: questionId, question, answer }) => ({
                id: questionId,
                title: question,
                content: answer,
              }))}
              defaultOpenIds={[questions[0].id]}
            />
          </section>
        ))}

        {filteredTopics.length === 0 && (
          <p className="py-8 text-center text-sm text-[#64748B]">
            No help topics match your search.
          </p>
        )}
      </div>
    </div>
  );
};

export default HelpSupportPage;
