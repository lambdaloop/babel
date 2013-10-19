class TextController < ApplicationController
  include TextHelper

  def get
    m = /([pn])([0-9]+)x([pn])([0-9]+)/
    match = m.match(params[:pos])
    if match.blank?
      out = "An error occurred. Try refreshing the page."
    else
      x = match[2].to_i
      x = -1 * x if match[1] == "n"
      y = match[4].to_i
      y = -1 * y if match[3] == "n"

      p = params[:num].to_i
      p = BookNumber * ShelfNumber - 1 if p >= BookNumber * ShelfNumber
      p = 0 if p < 0
      out = gen_xyz(x,y,p)

    end

    render json: {
      text: out
    }
    
  end

  def babel
    m = /([pn])([0-9]+)x([pn])([0-9]+)/
    match = m.match(params[:pos])
    if match.blank?
      out = false
    else
      x = match[2].to_i
      x = -1 * x if match[1] == "n"
      y = match[4].to_i
      y = -1 * y if match[3] == "n"
      @x, @y = x,y
      @pos = match[0]
    end
    
  end
end
