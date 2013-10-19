module TextHelper

  Letters = ('A'..'Z').to_a + " .?!".split("")

  CharacterNumber = 50 # should be 80
  LineNumber = 30
  PageNumber = 410
  BookNumber = 35
  ShelfNumber = 4 # should be 5
  
  def page(r)
    out = ""
    for line in 1..LineNumber
      out << (1..CharacterNumber).map {|x| Letters[r.rand(Letters.length)] }.join('')
      out << "<br/>"
    end
    return [out, r]
  end

  def generate(x)
    r = Random.new(x)
    pages = []
    for n in 1..PageNumber
      p, r = page(r)
      pages << p
    end
    return pages
  end


  def neg_nat(a)
    if a >= 0
      a*2
    else
      -a*2+1
    end
  end

  def cantor(x,y)
    x = neg_nat(x)
    y = neg_nat(y)
    ((x+y)*(x+y+1))/2+y
  end

  def cantor3(x,y,z)
    cantor(cantor(x,y), z)
  end
  
  def gen_xyz(x,y,z)
    return generate(cantor3(x,y,z))
  end

end
