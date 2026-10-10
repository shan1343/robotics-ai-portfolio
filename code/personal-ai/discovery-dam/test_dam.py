import copy
import unittest
from dam import canonical, feedback, merge

class DamTests(unittest.TestCase):
    def setUp(self):
        self.control = {'version':3,'max_per_family':1,'blocked_urls':['https://youtu.be/excluded-example']}
        self.batch = {'run_id':'a','criteria_version':3,'observed_at':'2026-10-04T02:30:00+09:00','candidates':[
            {'url':'https://a.org/one?utm_source=x','title':'One','lane':'web','rank':1,'topics':['ai'],'evidence':'original'},
            {'url':'https://a.org/one','title':'One','lane':'exa','rank':2,'topics':['ai'],'evidence':'excerpt'},
            {'url':'https://a.org/two','title':'Two','lane':'web','rank':2,'topics':['ai']},
            {'url':'https://b.org/three','title':'Three','lane':'web','rank':3,'topics':['engineering']},
            {'url':'https://www.youtube.com/watch?v=excluded-example&si=x','title':'Blocked','lane':'web','rank':1}]}
    def test_replay_and_diversity(self):
        a=merge({'pending':[{'lane':'sns','error':'auth'}]},self.batch,self.control)
        b=merge(a,self.batch,self.control)
        self.assertEqual(a['metrics']['new'],3)
        self.assertEqual(b['metrics']['new'],0)
        self.assertEqual(b['metrics']['changed'],0)
        self.assertEqual(a['metrics']['families_selected'],2)
        self.assertEqual(a['metrics']['blocked'],1)
        self.assertEqual(a['pending'],b['pending'])
        self.assertEqual(a['candidates'][0]['evidence'],'original')
    def test_feedback_changes_selection_once(self):
        e={'id':'f1','expected_version':3,'literal':'prefer engineering','patch':{'preferred_topics':['engineering']}}
        c=feedback(self.control,e)
        self.assertEqual(feedback(c,e),c)
        b=copy.deepcopy(self.batch);b['criteria_version']=4
        self.assertEqual(merge({},b,c)['selected_keys'][0],'https://b.org/three')
        with self.assertRaises(ValueError): feedback(c,dict(e,id='f2'))
        with self.assertRaises(ValueError): merge({},self.batch,c)
    def test_source_keys(self):
        self.assertEqual(canonical('https://youtu.be/abc?si=def'),canonical('https://www.youtube.com/watch?v=abc&utm_source=x'))
        self.assertNotEqual(canonical('https://x.org/search?q=a'),canonical('https://x.org/search?q=b'))
        self.assertNotEqual(canonical('https://x.org/#a'),canonical('https://x.org/#b'))
        with self.assertRaises(ValueError):canonical('file:///private')
    def test_evictions_and_repeated_query(self):
        b=copy.deepcopy(self.batch)
        b['candidates']+=b['candidates']*5
        a=merge({},self.batch,self.control,limit=1,capacity=2)
        c=merge({},b,self.control,limit=1,capacity=2)
        self.assertEqual(a['candidates'],c['candidates'])
        self.assertEqual(a['metrics']['evicted'],1)
    def test_time_and_input(self):
        b=copy.deepcopy(self.batch);b['observed_at']='2026-10-04T02:30:00'
        with self.assertRaises(ValueError):merge({},b,self.control)

    def test_blocked_alias(self):
        b=copy.deepcopy(self.batch)
        b['candidates'][0]['event_key']='event'
        b['candidates'][2]['event_key']='event'
        a=merge({},b,self.control)
        c=copy.deepcopy(self.control);c['blocked_urls']+=['https://a.org/two']
        self.assertNotIn('event',merge(a,b,c)['selected_keys'])

    def test_temporary_scope(self):
        e={'id':'temp','expected_version':3,'literal':'this time','scope':'run','run_id':'a',
           'patch':{'preferred_topics':['engineering']}}
        c=feedback(self.control,e)
        b=copy.deepcopy(self.batch);b['criteria_version']=4
        merge({},b,c)
        b['run_id']='next'
        with self.assertRaises(ValueError):merge({},b,c)
        b=copy.deepcopy(self.batch);b['candidates'][0]['rank']=0
        with self.assertRaises(ValueError):merge({},b,self.control)

if __name__=='__main__':unittest.main()
